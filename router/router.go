package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"

	"go-fiber-test/handler"

	jwtware "github.com/gofiber/jwt/v2"
)

func Setup(app *fiber.App) {
	// Static content
	app.Static("/", "./static")

	// Auth routes
	app.Get("/login", handler.Login)
	app.Post("/login", handler.Login)

	app.Use("/ws", func(c *fiber.Ctx) error {
		if c.Get("host") == "localhost:3000" {
			c.Locals("Host", "Localhost:3000")
			return c.Next()
		}
		return c.Status(403).SendString("Request origin not allowed")
	})
	app.Get("/ws", websocket.New(handler.WsMessage))

	app.Get("/wsclient", func(c *fiber.Ctx) error {
		return c.Render("wsclient", fiber.Map{ "Title": "WS client"})
	})

	//Middleware de captura de token desde el cliente
	// app.Use(func (c *fiber.Ctx) error {
	// 	tk := c.Cookies("creds")
	// 	if (len(tk) > 0) {
	// 		c.Request().Header.Add("Authorization", "Bearer " + tk)
	// 	}
	// 	return c.Next()
	// })

	// JWT middleware
	app.Use(jwtware.New(jwtware.Config{
		SigningKey: []byte("secret"),
		ContextKey: "user",
		TokenLookup: "cookie:creds",
		ErrorHandler: RedirectToLogin,
	}))

	
	// Rutas autenticadas
	app.Get("/", handler.Login)
	app.Get("/index", handler.Index)
	app.Get("/GetData/:id", handler.GetData)
	app.Get("/GetUsers", handler.GetUsers)

	// Not found route
	app.Use(func(c *fiber.Ctx) error {
		return c.SendStatus(404)
	})
}

func RedirectToLogin(c *fiber.Ctx, e error) error {
	handler.Login(c)
	return nil //c.Redirect("/login")
}