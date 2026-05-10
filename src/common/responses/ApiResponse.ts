/**
 * Standard API response wrapper used by controllers and exception filters.
 */
export class ApiResponse<T> {
  /**
   * ApiResponse constructor.
   *
   * @param {string} message - Technical response message.
   * @param {string} userMessage - User-facing response message.
   * @param {T} data - Response payload.
   */
  public constructor(
    public readonly message: string,
    public readonly userMessage: string,
    public readonly data: T,
  ) {}

  /**
   * Creates a successful API response.
   *
   * @param {T} data - Response payload.
   * @param {string} userMessage - User-facing success message.
   * @returns {ApiResponse<T>} The formatted success response.
   */
  public static success<T>(
    data: T,
    userMessage = 'sucesso',
  ): ApiResponse<T> {
    return new ApiResponse('success', userMessage, data);
  }

  /**
   * Creates an error API response.
   *
   * @param {string} message - Technical error message.
   * @param {string} userMessage - User-facing error message.
   * @param {T} data - Error payload.
   * @returns {ApiResponse<T>} The formatted error response.
   */
  public static error<T>(
    message: string,
    userMessage: string,
    data: T,
  ): ApiResponse<T> {
    return new ApiResponse(message, userMessage, data);
  }
}
