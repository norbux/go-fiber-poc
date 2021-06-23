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
	//fmt.Printf("Test...")

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

	//app.Static("/", "./static")

	// app.Get("/", func(c *fiber.Ctx) error {
	// 	return c.SendString("Probando Fiber...")
	// })

	router.Setup(app)

	// app.Get("/", func (c *fiber.Ctx) error {
	// 	return c.SendStatus(200)
	// })

	// app.Get("/log", func(c *fiber.Ctx) error {
	// 	//log.Fatalf("Esto es un elemento de log: %s", c.Path())
	// 	return c.SendString("Solo este endpoint genera log")
	// })

	// app.Get("/:param1", func(c *fiber.Ctx) error {
	// 	var p1 = c.Params("param1")
	// 	var output = fmt.Sprintf("the path is /:param1: %s", p1)
	// 	return c.SendString(output)
	// })
	
	// app.Get("*", func(c *fiber.Ctx) error {
	// 	return c.SendString("the path is *: " + c.Params(("*")))
	// }) 
	
	// app.Get("/:param1/:param2", func(c *fiber.Ctx) error {
	// 	var p1 = c.Params("param1")
	// 	var p2 = c.Params("param2")
	// 	var output = fmt.Sprintf("the path is /:param1/:param2 : %s param2: %s", p1, p2)
	// 	return c.SendString(output)
	// })

	// app.Get("/*", func(c *fiber.Ctx) error {
	// 	fmt.Printf("Endpoint no encontrado: %d\n", 404)
	// 	c.Status(404)
	// 	return c.Next()
	// })	

	app.Listen(":3000")
}

