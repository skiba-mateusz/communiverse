package uploader

import (
	"bytes"
	"context"
	"fmt"
	"image"
	"image/jpeg"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/disintegration/imaging"
	"github.com/google/uuid"
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

type UploadImageOptions struct {
	Width int
	Height int
	Quality int
	MimeType string
	Folder string
}

func (u *S3Uploader) ProcessAndUploadImage(ctx context.Context, image image.Image, options UploadImageOptions) (string, string, error) {
	resizedImage := u.processImage(image, options.Width, options.Height)
	encodedImage, err := u.encodeImage(resizedImage, options.Quality, options.MimeType)
	if err != nil {
		return "", "", err
	}

	id := uuid.New().String()
	key := fmt.Sprintf("%s/%s", options.Folder, id)

	if err = u.UploadFile(ctx, encodedImage, key, options.MimeType); err != nil {
		return "", "", err
	}

	return id, key, nil
}

func (u *S3Uploader) UploadFile(ctx context.Context, file []byte, key, contentType string) error {
	_, err := u.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      &u.bucket,
		Key:         &key,
		Body:        bytes.NewReader(file),
		ContentType: &contentType,
	})
	if err != nil {
		return err
	}

	return nil
}

func (u *S3Uploader) DeleteFile(ctx context.Context, key string) error {
	_, err := u.client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: &u.bucket,
		Key:    &key,
	})
	if err != nil {
		return err
	}

	return nil
}

func (u *S3Uploader) processImage(image image.Image, width, height int) image.Image {
	return imaging.Fill(image, width, height, imaging.Center, imaging.Lanczos)
}

func (u *S3Uploader) encodeImage(image image.Image, quality int, mimeType string) ([]byte, error) {
	buf := new(bytes.Buffer)
	if mimeType != "image/jpeg" {
		return nil, fmt.Errorf("unsupported mime type: %s", mimeType)
	}

	if err := jpeg.Encode(buf, image, &jpeg.Options{
		Quality: quality,
	}); err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}