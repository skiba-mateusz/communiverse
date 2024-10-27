package uploader

import (
	"bytes"
	"context"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type S3Uploader struct {
	client *s3.Client
	bucket string
}

func NewS3Uploader(bucket string) (*S3Uploader, error) {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		return nil, err
	}

	client := s3.NewFromConfig(cfg)

	return &S3Uploader{
		client: client,
		bucket: bucket,
	}, nil
}

func (u *S3Uploader) UploadFile(ctx context.Context, file []byte, key string) error {
	_, err := u.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket: &u.bucket,
		Key:    &key,
		Body:   bytes.NewReader(file),
	})
	if err != nil {
		return err
	}

	return nil
}

func (u *S3Uploader) DownloadFile(ctx context.Context, key string) ([]byte, error) {
	output, err := u.client.GetObject(ctx, &s3.GetObjectInput{
		Bucket: &u.bucket,
		Key:    &key,
	})
	if err != nil {
		return nil, err
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(output.Body)

	return buf.Bytes(), nil
}