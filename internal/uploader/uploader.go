package uploader

import (
	"context"
	"image"
)

type Client interface {
	UploadFile(ctx context.Context, file []byte, key, contentType string) error
	DeleteFile(ctx context.Context, key string) error
	ProcessAndUploadImage(ctx context.Context, image image.Image, options UploadImageOptions) (string, string, error)
}
