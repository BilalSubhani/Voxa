export class ResponseUtil {
  static success(message: string, data: any = {}) {
    return {
      status: 1,
      message,
      data,
    };
  }

  static error(message: string, data: any = {}) {
    return {
      status: 0,
      message,
      data,
    };
  }
}
