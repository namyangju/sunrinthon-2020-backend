import C from '@lib/blueprint/Controller';
import Bid from '@models/Bid';

export default new (class extends C {
  constructor() {
    super();
    this.router.get('/', C.auth.authority.user, this.getBid);
    this.router.post('/', C.auth.authority.user, this.createBid);
    this.router.post(
      '/participate',
      C.auth.authority.user,
      this.participateBid,
    );
    this.router.patch('/:bidid', C.auth.authority.user, this.selectWorker);
  }

  private getBid = C.Wrapper(async (req, res) => {
    const { skip, limit, search, user } = req.query;
    const query = { user, status: 'waiting' };
    if (search) {
      const $regex = new RegExp(
        '(' + search.toString().replace(/ /g, '|') + ')',
        'gi',
      );
      Object.assign(query, {
        $or: [{ title: $regex }, { description: $regex }],
      });
    }
    const bid = await Bid.find(C.assets.updateQueryBuilder(query) || {})
      .skip(C.assets.data.filter(skip as string, 'number') || 0)
      .limit(C.assets.data.filter(limit, 'number') || 10)
      .sort('-_id')
      .exec();
    if (!bid.length) throw C.error.db.notfound();
    res(200, bid);
  });

  private createBid = C.Wrapper(async (req, res) => {
    const { title, description, price } = req.body;
    C.assets.checkNull(title, description, price);
    const bid = new Bid({
      title,
      description,
      price,
      user: req.body.userData._id,
    });
    await bid.save();
    res(201, bid);
  });

  private selectWorker = C.Wrapper(async (req, res) => {
    const { worker } = req.body;
    const { bidid } = req.params;
    C.assets.checkNull(worker);
    const bid = await Bid.findByIdAndUpdate(bidid, {
      $set: { selectedUser: worker, status: 'resolved' },
    });
    if (!bid) throw C.error.db.notfound();
    res(200, bid);
  });

  private participateBid = C.Wrapper(async (req, res) => {});
})();
