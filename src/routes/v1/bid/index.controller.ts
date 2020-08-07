import C from '@lib/blueprint/Controller';
import Bid from '@models/Bid';
import User from '@models/User';
import Work from '@models/Work';

export default new (class extends C {
  constructor() {
    super();
    this.router.get('/', this.getBid);
    this.router.get('/:bidid', this.getBidById);
    this.router.post('/', C.auth.authority.user, this.createBid);
    this.router.post(
      '/participate/:bidid',
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

  private getBidById = C.Wrapper(async (req, res) => {
    const { bidid } = req.params;
    const bid = await Bid.findById(bidid).exec();
    if (!bid) throw C.error.db.notfound();
    res(200, bid);
  });

  private createBid = C.Wrapper(async (req, res) => {
    const { title, description, price, phrase } = req.body;
    C.assets.checkNull(title, description, price, phrase);
    const bid = new Bid({
      title,
      description,
      price,
      user: req.body.userData._id,
      phrase,
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
    const user = await User.findById(worker).exec();
    if (!user) throw C.error.db.notfound();
    if (!bid) throw C.error.db.notfound();
    res(200, { bid, email: user.userid });
  });

  private participateBid = C.Wrapper(async (req, res) => {
    const { bidid } = req.params;
    const participant = req.body.userData._id;
    const legacyBid = await Bid.findById(bidid).exec();
    if (!legacyBid) throw C.error.db.notfound();
    if (legacyBid.participant?.indexOf(participant) !== -1)
      throw C.error.db.exists();
    legacyBid.participant.push(participant);
    const newBid = await Bid.findByIdAndUpdate(bidid, { $set: legacyBid });
    res(200, newBid as any);
  });
})();
