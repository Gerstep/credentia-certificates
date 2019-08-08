import { BaseHttpController } from 'inversify-express-utils';

export class BaseController extends BaseHttpController {
  sendSuccessJSON(data?: any) {
    return this.json({status: 'ok', data}, 200);
  }

  sendErrorJSON(error: string, statusCode: number) {
    return this.json({status: 'error', error}, statusCode);
  }
}
