import C from '@lib/blueprint/Controller';
import Request from '@models/Request';

export default new (class extends C {
  constructor() {
    super();
    this.router.get('/', C.auth.authority.user, this.getRequest);
    this.router.post('/', C.auth.authority.user, this.postRequest);
    this.router.patch(
      '/:requestid',
      C.auth.authority.user,
      this.resolveRequest,
    );
  }

  private getRequest = C.Wrapper(async (req, res) => {
    const { skip, limit } = req.query;
    const request = await Request.find({ worker: req.body.userData._id })
      .skip(C.assets.data.filter(skip, 'number') || 0)
      .limit(C.assets.data.filter(limit, 'number') || 10)
      .sort('-_id')
      .exec();
    if (!request.length) throw C.error.db.notfound();
    res(200, request);
  });

  private postRequest = C.Wrapper(async (req, res) => {
    const { worker, title, description } = req.body;
    const issuer = req.body.userData._id;
    C.assets.checkNull(worker, title, description, issuer);
    const request = new Request({ worker, title, description, issuer });
    await request.save();

    res(201, request);
  });

  private resolveRequest = C.Wrapper(async (req, res) => {
    const { requestid } = req.params;
    const { status } = req.body;

    const request = await Request.findByIdAndUpdate(requestid, {
      $set: { status },
    });
    if (!request) throw C.error.db.notfound();
    res(200, request);
  });
})();
