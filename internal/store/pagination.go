package store

import (
	"net/http"
	"strconv"
)

type PaginatedPostsQuery struct {
	Search string `json:"search" validate:"max=100"`
	Limit  int    `json:"limit" validate:"gte=1,lte=20"`
	Offset int    `json:"offset" validate:"gte=0"`
	Time string `json:"time" validate:"oneof=today week month year all-time"`
	View   string `json:"view" validate:"oneof=top discussed latest"`
	Sort string `json:"sort" validate:"oneof=asc desc"`
}

type Meta struct {
	TotalCount int `json:"totalCount"`
	TotalPages int `json:"totalPages"`
	CurrentPage int `json:"currentPage"`
	Offset int `json:"offset"`
	Limit int `json:"limit"`
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

	time := qs.Get("time")
	if time != "" {
		pq.Time = time
	}

	view := qs.Get("view")
	if view != "" {
		pq.View = view
	}

	sort := qs.Get("sort")
	if sort != "" {
		pq.Sort = sort
	}

	return pq, nil
}

type PaginatedCommunitiesQuery struct {
	Search string `json:"search" validate:"max=100"`
	Limit  int    `json:"limit" validate:"gte=1,lte=20"`
	Offset int    `json:"offset" validate:"gte=0"`
}

func (cq PaginatedCommunitiesQuery) Parse(r *http.Request) (PaginatedCommunitiesQuery, error) {
	qs := r.URL.Query()

	search := qs.Get("search")
	if search != "" {
		cq.Search = search
	}

	limit := qs.Get("limit")
	if limit != "" {
		l, err := strconv.Atoi(limit)
		if err != nil {
			return cq, err
		}
		cq.Limit = l
	}

	offset := qs.Get("offset")
	if offset != "" {
		o, err := strconv.Atoi(offset)
		if err != nil {
			return cq, err
		}
		cq.Offset = o
	}

	return cq, nil
}
