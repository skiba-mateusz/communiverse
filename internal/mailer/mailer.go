package mailer

import "embed"

var (
	fromName               = "Communiverse Team"
	maxRetries             = 3
	InviteUserTemplate     = "user_invitation.gohtml"
	ForgotPasswordTemplate = "forgot_password.gohtml"
)

//go:embed "templates"
var FS embed.FS

type Client interface {
	Send(templateFile, username, email string, data any, isSadbox bool) (int, error)
}
