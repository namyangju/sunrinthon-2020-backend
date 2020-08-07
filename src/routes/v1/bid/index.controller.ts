import C from '@lib/blueprint/Controller';

export default new (class extends C {
  constructor() {
    super();
  }
  private createBid = C.Wrapper(async (req, res) => {});

  private selectWorker = C.Wrapper(async (req, res) => {});

  private participateBid = C.Wrapper(async (req, res) => {});
})();
