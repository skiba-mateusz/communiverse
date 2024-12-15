package db

import (
	"context"
	"database/sql"
	"fmt"

	"log"
	"math/rand"

	"github.com/gosimple/slug"
	"github.com/skiba-mateusz/communiverse/internal/store"
)

var (
	names = []string{
		"Alice Johnson", "Bob Smith", "Charlie Williams", "David Brown",
		"Eve Davis", "Frank Miller", "Grace Wilson", "Hannah Moore",
		"Ian Taylor", "Julia Anderson", "Kevin Thomas", "Liam Jackson",
		"Mia White", "Noah Harris", "Olivia Martin", "Peter Thompson",
		"Quinn Garcia", "Rachel Martinez", "Sam Walker", "Tina Lee",
		"Ursula Clark", "Victor Hall", "Wendy Lewis", "Xander Young",
		"Yara King",
	}

	usernames = []string{
		"alice_johnson", "bobsmith", "charlie.williams", "david_brown",
		"eve_davis", "frank_miller", "grace_wilson", "hannah.moore",
		"ian_taylor", "julia.anderson", "kevint", "liam_j",
		"mia_white", "noah.harris", "olivia_m", "peter.t",
		"quinn_garcia", "rachel.m", "sam_walker", "tina.lee",
		"ursula_clark", "victor_hall", "wendy.lewis", "xander_young",
		"yara.king",
	}

	professions = []string{
		"Software Engineer", "Graphic Designer", "Data Scientist", "Web Developer",
		"Project Manager", "UX Researcher", "Content Writer", "Software Tester",
		"DevOps Engineer", "Data Analyst", "Mobile App Developer", "SEO Specialist",
		"Database Administrator", "Systems Analyst", "Cloud Engineer", "Network Administrator",
		"Product Owner", "Business Analyst", "Frontend Developer", "Backend Developer",
		"Game Developer", "Security Analyst", "Ethical Hacker", "System Architect",
		"Blockchain Developer",
	}

	communities = map[string]string{
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

	titles = []string{
		"The Future of Technology in 2024",
		"10 Tips for a Healthier Lifestyle",
		"Exploring the Best National Parks",
		"How to Start a Successful Blog",
		"Understanding Artificial Intelligence",
		"The Impact of Climate Change on Wildlife",
		"Creative Art Techniques for Beginners",
		"Top 5 Programming Languages to Learn",
		"The Benefits of Mindfulness Meditation",
		"How to Travel on a Budget",
		"Must-Read Books for Personal Growth",
		"Delicious Recipes for Quick Meals",
		"Exploring the World of Video Games",
		"The Importance of Financial Literacy",
		"Tips for Effective Remote Work",
		"The Best Movies of the Year",
		"How to Build a Great Online Portfolio",
		"Essential Skills for Career Advancement",
		"Understanding Cryptocurrency",
		"Photography Tips for Beginners",
	}

	contents = []string{
		"Technology is evolving rapidly. Here are some trends that will shape the future of our lives in 2024.",
		"Adopting a healthier lifestyle can be easy with these simple tips. Start your journey towards better health today!",
		"National parks are a treasure trove of beauty and adventure. Discover some of the most breathtaking parks to visit.",
		"Starting a blog can be a rewarding experience. Learn the steps you need to take to launch your blog successfully.",
		"Artificial intelligence is changing the world. Here’s a look at its current applications and future potential.",
		"Climate change is affecting wildlife around the globe. Understand its impact and how we can help.",
		"Unleash your creativity with these fun and simple art techniques that anyone can try, regardless of skill level.",
		"Learning a new programming language can be daunting. Here are the top 5 languages that can boost your career.",
		"Mindfulness meditation can improve your mental well-being. Discover its benefits and how to get started.",
		"Traveling doesn't have to be expensive. Here are some practical tips to make the most of your travel adventures on a budget.",
		"Personal growth is an important journey. Here are some must-read books that can inspire and guide you.",
		"Cooking can be quick and satisfying. Try these delicious recipes that require minimal preparation.",
		"Video games have become a significant part of our culture. Explore the world of gaming and its many facets.",
		"Financial literacy is crucial in today’s world. Here are some concepts everyone should understand.",
		"Remote work can be challenging. Here are tips to enhance productivity and work-life balance while working from home.",
		"Catch up on the best movies released this year, featuring diverse genres and unforgettable stories.",
		"Building an online portfolio can showcase your work. Here’s how to create a compelling and attractive portfolio.",
		"Essential skills can set you apart in your career. Learn what skills are most in demand today.",
		"Cryptocurrency is a hot topic in finance. Understand the basics and how it’s changing the landscape.",
		"Photography is an art form that anyone can master. Check out these tips to improve your photography skills.",
	}

	tags = []string{
		"Technology", "Health", "Travel", "Blogging",
		"AI", "Climate Change", "Art", "Programming",
		"Mindfulness", "Budget Travel", "Personal Growth", "Cooking",
		"Video Games", "Finance", "Remote Work", "Movies",
		"Portfolio", "Career", "Cryptocurrency", "Photography",
	}

	comments = []string{
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
)

func Seed(store store.Storage, db *sql.DB) {
	ctx := context.Background()

	users := generateUsers(100)
	tx, _ := db.BeginTx(ctx, nil)

	for _, user := range users {

		if err := store.Users.Create(ctx, tx, user); err != nil {
			_ = tx.Rollback()
			log.Println("Error creating user:", err)
			return
		}
	}

	if err := tx.Commit(); err != nil {
		log.Println("Error committing transaction:", err)
		return
	}

	communities := generateCommunities(users)
	for _, community := range communities {
		if err := store.Communities.Create(ctx, community); err != nil {
			log.Println("Error creating communities:", err)
			return
		}
	}

	userCommunities := generateUserCommunities(200, communities, users)
	for userID, communityID := range userCommunities {
		if err := store.Communities.Join(ctx, communityID, userID, "member"); err != nil {
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

func generateUsers(num int) []*store.UserDetails {
	users := make([]*store.UserDetails, num)

	for i := 0; i < num; i++ {
		users[i] = &store.UserDetails{
			BaseUser: store.BaseUser{
				Name:     names[i%len(names)],
				Username: fmt.Sprintf("%s%d", usernames[i%len(usernames)], i),
			},
			Email:    fmt.Sprintf("%s%d@example.com", usernames[i%len(usernames)], i),
			Role: store.Role{
				Name: "user",
			},
		}
		users[i].Password.Set("123456")
		
	}

	return users
}

func generateCommunities(users []*store.UserDetails) []*store.CommunityDetails {
	c := make([]*store.CommunityDetails, 0, len(communities))

	for name, description := range communities {
		user := users[rand.Intn(len(users))]

		c = append(c, &store.CommunityDetails{
			BaseCommunity: store.BaseCommunity{
				Name:        name,
				Slug:        slug.Make(name),
			},
			Description: description,
			UserID:      user.ID,
		})
	}

	return c
}

func generateUserCommunities(num int, communities []*store.CommunityDetails, users []*store.UserDetails) map[int64]int64 {
	uc := map[int64]int64{}

	for i := 0; i < num; i++ {
		userID := users[rand.Intn(len(users))].ID
		communityID := communities[rand.Intn(len(communities))].ID
		uc[userID] = communityID
	}

	return uc
}

func generatePosts(num int, communities []*store.CommunityDetails, users []*store.UserDetails) []*store.PostDetails {
	p := make([]*store.PostDetails, num)

	for i := 0; i < num; i++ {
		user := users[rand.Intn(len(users))]
		community := communities[rand.Intn(len(communities))]

		title := titles[i%len(titles)]

		p[i] = &store.PostDetails{
			BasePost: store.BasePost{
				Title:       title,
				Content:     contents[i%len(contents)],
				Tags:        []string{tags[i%len(tags)]},
				Slug:        fmt.Sprintf("%s-%d", slug.Make(title), i),
				UserID:      user.ID,
				CommunityID: community.ID,
			},
		}
	}

	return p
}

func generateComments(num int, users []*store.UserDetails, posts []*store.PostDetails) []*store.Comment {
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
