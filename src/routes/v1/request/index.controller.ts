import C from '@lib/blueprint/Controller';
import Request from '@models/Request';

export default new (class extends C {
  constructor() {
    super();
  }

  private getRequest = C.Wrapper(async (req, res) => {
    // const {skip,limit}  = req.body;
    // const request = await Request.find({})
  });

  private postRequest = C.Wrapper(async (req, res) => {});
})();
