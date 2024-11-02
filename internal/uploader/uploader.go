package uploader

import "context"

type Client interface {
	UploadFile(ctx context.Context, file []byte, key, contentType string) error
	DeleteFile(ctx context.Context, key string) error
}
