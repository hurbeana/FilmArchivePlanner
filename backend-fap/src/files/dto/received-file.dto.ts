export class RecvFileDto {
  /**
   * Field name specified in the form
   */
  fieldname?: string;
  /**
   * Name of the file on the users computer
   */
  originalname: string;
  /**
   * Encoding type of the file
   */
  encoding?: string;
  /**
   * Mime type of the file
   */
  mimetype?: string;
  /**
   * The folder to which the file has been saved
   */
  destination: string;
  /**
   * The name of the file within the destination
   */
  filename: string;
  /**
   * The full path to the uploaded file
   */
  path: string;
  /**
   * Size of the file in bytes
   */
  size?: number;
}
