/**
 * Type declarations cho @faceio/fiojs module
 */
declare module "@faceio/fiojs" {
  interface FaceIOEnrollOptions {
    locale?: string;
    payload?: {
      email?: string;
      [key: string]: unknown;
    };
  }

  interface FaceIOAuthenticateOptions {
    locale?: string;
  }

  interface FaceIOEnrollResponse {
    facialId: string;
    payload?: {
      email?: string;
      [key: string]: unknown;
    };
  }

  interface FaceIOAuthenticateResponse {
    facialId: string;
  }

  class FaceIO {
    constructor(appId: string);
    enroll(options: FaceIOEnrollOptions): Promise<FaceIOEnrollResponse>;
    authenticate(options: FaceIOAuthenticateOptions): Promise<FaceIOAuthenticateResponse>;
  }

  export default FaceIO;
}
