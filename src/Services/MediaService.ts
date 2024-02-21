import { PassThrough } from "stream";
import IDatabaseContext from "../Shared/Context/IDatabaseContext";
import { MediaRepository } from "../Application/Repository/MediaRepository";
import fs from "fs-extra";
import path from "path";

export class MediaService{
  private mediaRepository: MediaRepository;
  private pathLocation: string = path.resolve(__dirname, './public/images')
  private uuid: string | null
  
  constructor(database: IDatabaseContext){
    this.mediaRepository = new MediaRepository(database)
    this.uuid = null
  }

  save(): PassThrough{
    const passThrough = new PassThrough();

    const file = this.pathLocation+`${this.uuid}.png`

    const pipe = passThrough.pipe(fs.createWriteStream(file))

    pipe.on('finish', async () => {
      const save = await this.mediaRepository.create({
        mediaType: 'image',
        path: file,
        altText: '',
        tags: ['']
      })

      save.id ? this.uuid = save.id : null
    })

    return passThrough
  }

  getUUID(){
    return this.uuid
  }

}