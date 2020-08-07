import C from '@lib/blueprint/Controller';
import Work, { WorkInterface } from '@models/Work';
import Aws from '@util/Aws';
import { UploadedFile } from 'express-fileupload';

export default new (class extends C {
  constructor() {
    super();
    this.router.get('/', C.auth.authority.user, this.getWork);
    this.router.get('/user', C.auth.authority.user, this.getWorkByUser);
    this.router.post('/', C.auth.authority.user, this.postWork);
  }

  private getWork = C.Wrapper(async (req, res) => {
    const { skip, limit, search } = req.body;
    const query = {};
    if (search) {
      const $regex = new RegExp(
        '(' + search.toString().replace(/ /g, '|') + ')',
        'gi',
      );
      Object.assign(query, {
        $or: [{ title: $regex }, { description: $regex }],
      });
    }
    const work = await Work.find(query)
      .skip(C.assets.data.filter(skip as string, 'number') || 0)
      .limit(C.assets.data.filter(limit, 'number') || 10)
      .sort('-_id')
      .exec();

    if (!work) throw C.error.db.notfound();
    res(200, work);
  });

  private getWorkByUser = C.Wrapper(async (req, res) => {
    const { skip, limit } = req.body;
    const work = await Work.find({ author: req.body.userData._id })
      .skip(C.assets.data.filter(skip as string, 'number') || 0)
      .limit(C.assets.data.filter(limit, 'number') || 10)
      .sort('-_id')
      .exec();
    if (!work) throw C.error.db.notfound();
    res(200, work);
  });

  private postWork = C.Wrapper(async (req, res) => {
    const { title, description } = req.body;
    const image = req.files?.image as UploadedFile;
    if (!image) throw C.error.db.notfound();
    const data: WorkInterface = {
      title,
      description,
      author: req.body.userData._id,
      image: (
        await Aws.S3.upload({
          Bucket: 'sunrinthon-namyangju-typewriter',
          Key: `image/${Date.now()}_${image.name}`,
          Body: image.data,
        })
      ).Location,
    };
    const work = new Work(data);
    await work.save();
    res(200, work);
  });
})();
