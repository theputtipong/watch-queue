import { Request, Response } from 'express';
import { contentService } from '../services/content.service';
export class ContentController {
  public getContents = (req: Request, res: Response): void => {
    try {
      const search = req.query.search as string;
      const genre = req.query.genre as string;
      const contents = contentService.getContents(search, genre);
      res.status(200).json(contents);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
export const contentController = new ContentController();
