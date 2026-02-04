const { sendContactEmail } = require("./emailService.js");
const { parseBody } = require("./validation.js");
const { sendSuccess, handleError } = require("./responseHandler.js");

/**
 * Handles contact form submission by sending an email.
 * POST /sendContactMessage
 * Body: { name, email, phone, message, subject }
 */
exports.sendContactMessage = async (req, res) => {
  try {
    const body = parseBody(req.body);
    const { name, email, phone, message, subject } = body;

    // Basic validation
    if (!name || !email || !message) {
      return handleError(
        res,
        400,
        "Missing required fields: name, email, message",
      );
    }

    const result = await sendContactEmail({
      name,
      email,
      phone,
      message,
      subject,
    });

    if (result.success) {
      return sendSuccess(res, {
        message: "Email sent successfully",
        messageId: result.messageId,
      });
    } else {
      return handleError(res, 500, "Failed to send email", result.error);
    }
  } catch (error) {
    return handleError(res, 500, "Internal Server Error", error.message);
  }
};
