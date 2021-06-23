package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html"

	//"github.com/gofiber/fiber/v2/middleware/logger"
	"go-fiber-test/router"
)

func main() {	
	engine := html.New("./views", ".html")

	app := fiber.New(fiber.Config{
		Views: engine,
	})

	// app.Use(logger.New(logger.Config{
	// 	Next: func(c *fiber.Ctx) bool {
	// 		status := c.Response().StatusCode() != 404
	// 		//rt := c.Path() != "/log"
	// 		//result := (c.Path() != "/log")
	// 		result := status //(status || rt)
	// 		return result
	// 	},
	// 	TimeFormat: "02-Jan-2006 15:04:05",
	// 	TimeZone: "America/Mexico_City",
	// }))

	router.Setup(app)

	app.Listen(":3000")
}

