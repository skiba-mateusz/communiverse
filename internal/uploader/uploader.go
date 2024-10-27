package uploader

import "context"

type Client interface {
	UploadFile(ctx context.Context, file []byte, key string) error
	DownloadFile(ctx context.Context, key string) ([]byte, error)
}
