export class UploadImageResponse {
  id!: number;
  src!: string;

  constructor(args: UploadImageResponse) {
    Object.assign(this, args);
  }

  static from(args: { id: number; path: string }) {
    return new UploadImageResponse({
      id: args.id,
      src: `http://localhost:3000/${args.path}`,
    });
  }
}
