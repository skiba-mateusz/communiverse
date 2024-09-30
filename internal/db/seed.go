package db

import (
	"context"
	"fmt"
	"log"
	"math/rand"

	"github.com/gosimple/slug"
	"github.com/skiba-mateusz/communiverse/internal/store"
)

var names = []string{
	"Alice",
	"Bob",
	"Charlie",
	"David",
	"Eve",
	"Frank",
	"Grace",
	"Hannah",
	"Ian",
	"Julia",
	"Kevin",
	"Liam",
	"Mia",
	"Noah",
	"Olivia",
	"Peter",
	"Quinn",
	"Rachel",
	"Sam",
	"Tina",
	"Ursula",
	"Victor",
	"Wendy",
	"Xander",
	"Yara",
	"Zoe",
}

var communities = map[string]string{
	"The Gamers Hub":          "A place for gamers to discuss their favorite games, share tips, and find teammates.",
	"Bookworms Unite":         "A cozy corner for book lovers to share recommendations, reviews, and book-related discussions.",
	"Tech Talk":               "A community for tech enthusiasts to discuss the latest gadgets, software, and industry trends.",
	"Artistic Souls":          "A creative space for artists to showcase their work, share techniques, and inspire each other.",
	"Fitness Fanatics":        "A supportive community for fitness lovers to share workout routines, nutrition tips, and motivation.",
	"Movie Buffs":             "A film lover’s paradise to discuss, review, and recommend movies across all genres.",
	"Foodie Friends":          "A delicious community where food lovers can share recipes, reviews, and culinary tips.",
	"Travel Enthusiasts":      "A place for adventurers to share travel tips, experiences, and dream destinations.",
	"Pet Lovers":              "A community for pet owners to share adorable photos, tips, and pet care advice.",
	"Music Masters":           "A gathering spot for music lovers to discuss their favorite artists, albums, and genres.",
	"DIY Creators":            "A hands-on community for crafters and DIY enthusiasts to share projects and ideas.",
	"Anime Addicts":           "A haven for anime fans to discuss their favorite series, characters, and upcoming releases.",
	"Science Explorers":       "A curious community for science lovers to share discoveries, articles, and experiments.",
	"History Buffs":           "A space for history enthusiasts to discuss historical events, figures, and trivia.",
	"Nature Lovers":           "A community for outdoor enthusiasts to share nature photos, conservation tips, and adventures.",
	"Fantasy Realm":           "A magical community for fans of fantasy literature, games, and role-playing.",
	"Sports Junkies":          "A gathering place for sports fans to discuss games, teams, and athlete news.",
	"Comic Book Collectors":   "A community for comic book fans to discuss their favorite comics, characters, and collectibles.",
	"Photography Enthusiasts": "A visual community for photographers to share their work, techniques, and tips.",
	"Mindfulness Community":   "A supportive space for those interested in mindfulness, meditation, and self-improvement.",
}

var titles = []string{
	"The Ultimate Gaming Setup",
	"Must-Read Books for 2024",
	"Top 10 Tech Gadgets You Need",
	"Creative Art Techniques for Beginners",
	"How to Stay Fit at Home",
	"Best Movies of the Year",
	"Delicious Recipes for Quick Meals",
	"Travel Tips for Adventurers",
	"Pet Care Essentials Every Owner Should Know",
	"Music Albums You Can’t Miss",
	"DIY Projects for Every Skill Level",
	"Anime Series Worth Watching",
	"Fascinating Science Discoveries",
	"Historical Events That Changed the World",
	"Exploring National Parks",
	"Fantasy Books That Will Transport You",
	"Essential Gear for Sports Lovers",
	"Comic Books You Should Read",
	"Photography Tips for Beginners",
	"Mindfulness Practices for Daily Life",
}

var contents = []string{
	"Setting up the perfect gaming environment can elevate your experience. Here are some tips to optimize your space and equipment.",
	"These books are must-reads for anyone looking to expand their knowledge and imagination in 2024. Check out the list!",
	"Stay updated with the latest tech trends. Here are some gadgets that every tech enthusiast should consider adding to their collection.",
	"Whether you're just starting or looking to refine your skills, these art techniques will help unleash your creativity.",
	"Fitness doesn't have to be complicated. Here are some simple yet effective routines you can do at home.",
	"Explore the cinematic gems of the year that you may have missed. From action to drama, there's something for everyone!",
	"Cooking can be fun and quick! Here are some delicious recipes that are easy to prepare.",
	"Ready to explore the world? Here are some tips to make the most of your travel adventures!",
	"Caring for pets requires dedication. Learn about the essentials that every pet owner should know.",
	"Discover music albums that have defined genres and touched hearts. These are the albums you should listen to.",
	"Get crafty! Here are some DIY projects that cater to all skill levels, from beginner to expert.",
	"Dive into the world of anime with these series that offer captivating stories and stunning visuals.",
	"Science is ever-evolving. Discover some of the latest discoveries that have fascinated researchers and enthusiasts alike.",
	"History is filled with events that have shaped our present. Explore these pivotal moments in time.",
	"Nature awaits! Explore the breathtaking beauty of national parks and the adventures they offer.",
	"Fantasy literature transports readers to magical worlds. Here are some books that will spark your imagination.",
	"Whether you're a player or a fan, here’s the essential gear that sports lovers shouldn't be without.",
	"Comic books have a rich history and culture. Discover which titles are worth your time and attention.",
	"Photography is an art that requires practice. Here are some tips to help you capture stunning images.",
	"Mindfulness can transform your life. Explore simple practices that can be incorporated into your daily routine.",
}

var tags = []string{
	"Gaming",
	"Books",
	"Technology",
	"Art",
	"Fitness",
	"Movies",
	"Food",
	"Travel",
	"Pets",
	"Music",
	"DIY",
	"Anime",
	"Science",
	"History",
	"Nature",
	"Fantasy",
	"Sports",
	"Comics",
	"Photography",
	"Mindfulness",
}

var comments = []string{
	"Great insights! Thanks for sharing!",
	"I totally agree with this!",
	"This is so helpful, thank you!",
	"I've tried this technique before and loved it!",
	"Can you elaborate more on this topic?",
	"This deserves more attention!",
	"Awesome post! Can't wait to try it!",
	"I appreciate the recommendations!",
	"Very informative! Thank you!",
	"Have you considered this other perspective?",
	"Interesting take on this subject!",
	"I learned something new today!",
	"Your passion for this topic is evident!",
	"This is exactly what I needed!",
	"Such a well-researched article!",
	"Thanks for providing your experience!",
	"Looking forward to your next post!",
	"Can you provide sources for this information?",
	"Absolutely! This resonates with me.",
	"I disagree, here's why...",
	"This sparked a great discussion!",
}

func Seed(store store.Storage) {
	ctx := context.Background()

	users := generateUsers(100)
	for _, user := range users {
		if err := store.Users.Create(ctx, user); err != nil {
			log.Println("Error creating user:", err)
			return
		}
	}

	communities := generateCommunities(users)
	for _, community := range communities {
		if err := store.Communities.Create(ctx, community); err != nil {
			log.Println("Error creating communities:", err)
			return
		}
	}

	userCommunities := generateUserCommunities(300, communities, users)
	for userID, communityID := range userCommunities {
		if err := store.Communities.Join(ctx, communityID, userID); err != nil {
			log.Println("Error creating user communities:", err)
			return
		}
	}

	posts := generatePosts(200, communities, users)
	for _, post := range posts {
		if err := store.Posts.Create(ctx, post); err != nil {
			log.Println("Error creating post:", err)
			return
		}
	}

	comments := generateComments(500, users, posts)
	for _, comment := range comments {
		if err := store.Comments.Create(ctx, comment); err != nil {
			log.Println("Error creating comment:", err)
			return
		}
	}
}

func generateUsers(num int) []*store.User {
	users := make([]*store.User, num)

	for i := 0; i < num; i++ {
		users[i] = &store.User{
			Username: names[i%len(names)] + fmt.Sprintf("%d", i),
			Email:    names[i%len(names)] + fmt.Sprintf("%d", i) + "@example.com",
			Password: "123456",
		}
	}

	return users
}

func generateCommunities(users []*store.User) []*store.Community {
	c := make([]*store.Community, 0, len(communities))

	for name, description := range communities {
		user := users[rand.Intn(len(users))]

		c = append(c, &store.Community{
			UserID:      user.ID,
			Name:        name,
			Description: description,
			Slug:        slug.Make(name),
		})
	}

	return c
}

func generateUserCommunities(num int, communities []*store.Community, users []*store.User) map[int64]int64 {
	uc := map[int64]int64{}

	for i := 0; i < num; i++ {
		userID := users[rand.Intn(len(users))].ID
		communityID := communities[rand.Intn(len(communities))].ID
		uc[userID] = communityID
	}

	return uc
}

func generatePosts(num int, communities []*store.Community, users []*store.User) []*store.Post {
	p := make([]*store.Post, num)

	for i := 0; i < num; i++ {
		user := users[rand.Intn(len(users))]
		community := communities[rand.Intn(len(communities))]

		title := titles[i%len(titles)]

		p[i] = &store.Post{
			Title:       title,
			Content:     contents[rand.Intn(len(contents))],
			Tags:        []string{tags[rand.Intn(len(tags))], tags[rand.Intn(len(tags))]},
			Slug:        slug.Make(title) + fmt.Sprintf("-%d", i),
			UserID:      user.ID,
			CommunityID: community.ID,
		}
	}

	return p
}

func generateComments(num int, users []*store.User, posts []*store.Post) []*store.Comment {
	c := make([]*store.Comment, num)

	for i := 0; i < num; i++ {
		user := users[rand.Intn(len(users))]
		post := posts[rand.Intn(len(posts))]

		c[i] = &store.Comment{
			Content: comments[rand.Intn(len(comments))],
			UserID:  user.ID,
			PostID:  post.ID,
		}
	}

	return c
}
