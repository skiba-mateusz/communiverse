package store

import (
	"net/http"
	"strconv"
)

type PaginatedPostsQuery struct {
	Search string `json:"search" validate:"max=100"`
	Limit  int    `json:"limit" validate:"gte=1,lte=20"`
	Offset int    `json:"offset" validate:"gte=0"`
	Sort   string `json:"sort" validate:"oneof=asc desc"`
}

func (pq PaginatedPostsQuery) Parse(r *http.Request) (PaginatedPostsQuery, error) {
	qs := r.URL.Query()

	search := qs.Get("search")
	if search != "" {
		pq.Search = search
	}

	limit := qs.Get("limit")
	if limit != "" {
		l, err := strconv.Atoi(limit)
		if err != nil {
			return pq, err
		}
		pq.Limit = l
	}

	offset := qs.Get("offset")
	if offset != "" {
		o, err := strconv.Atoi(offset)
		if err != nil {
			return pq, err
		}
		pq.Offset = o
	}

	sort := qs.Get("sort")
	if sort != "" {
		pq.Sort = sort
	}

	return pq, nil
}
