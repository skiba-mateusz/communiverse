package store

import (
	"net/http"
	"strconv"
)

type PaginatedCommunityPostsQuery struct {
	Search string `json:"search" validate:"max=100"`
	Limit  int    `json:"limit" validate:"gte=1,lte=20"`
	Offset int    `json:"offset" validate:"gte=0"`
	Sort   string `json:"sort" validate:"oneof=asc desc"`
}

func (cpq PaginatedCommunityPostsQuery) Parse(r *http.Request) (PaginatedCommunityPostsQuery, error) {
	qs := r.URL.Query()

	search := qs.Get("search")
	if search != "" {
		cpq.Search = search
	}

	limit := qs.Get("limit")
	if limit != "" {
		l, err := strconv.Atoi(limit)
		if err != nil {
			return cpq, err
		}
		cpq.Limit = l
	}

	offset := qs.Get("offset")
	if offset != "" {
		o, err := strconv.Atoi(offset)
		if err != nil {
			return cpq, err
		}
		cpq.Offset = o
	}

	sort := qs.Get("sort")
	if sort != "" {
		cpq.Sort = sort
	}

	return cpq, nil
}
