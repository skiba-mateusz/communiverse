package main

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"strings"
)

func (app *application) basicAuthMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authorizationHeader := r.Header.Get("Authorization")
			if authorizationHeader == "" {
				app.unauthorizedBasicResponse(w, r, fmt.Errorf("authorization header is missing"))
				return
			}

			parts := strings.Split(authorizationHeader, " ")
			if len(parts) != 2 && parts[0] != "Basic" {
				app.unauthorizedBasicResponse(w, r, fmt.Errorf("authorization header is malformed"))
				return
			}

			decoded, err := base64.StdEncoding.DecodeString(parts[1])
			if err != nil {
				app.unauthorizedBasicResponse(w, r, err)
				return
			}

			user := app.config.auth.basic.user
			password := app.config.auth.basic.password

			creds := strings.SplitN(string(decoded), ":", 2)
			if len(creds) != 2 || creds[0] != user || creds[1] != password {
				app.unauthorizedBasicResponse(w, r, fmt.Errorf("invalid credentials"))
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
