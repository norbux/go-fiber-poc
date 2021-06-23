package handler

import (
	"database/sql"
	"fmt"
	dbmodels "go-fiber-test/db-models"
	"log"
	"os"
	"strconv"
	"time"

	jwt "github.com/form3tech-oss/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

func Connect() error {
	env_err := godotenv.Load()
	if env_err != nil {
		log.Fatal("Error al cargar el archivo .env")
	}

	prt, _ := strconv.Atoi(os.Getenv("DB_PORT"))

	var err error
	db, err = sql.Open(
		"postgres", 
		fmt.Sprintf(
			"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", 
			os.Getenv("DB_HOST"),
			prt,
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_NAME"),
		),
	)

	if err != nil {
		return err
	}

	if err = db.Ping(); err != nil {
		return err
	}

	return nil
}

func dbConnect() {
	if err := Connect(); err != nil {
		log.Fatal(err)
	}
}

func Login(c *fiber.Ctx) error {
	if c.Method() == "GET" {
		return c.Render("login", fiber.Map{
			"Title": "Lojjin",
		})
	} else if c.Method() == "POST" {
		user := c.FormValue("user")
		pass := c.FormValue("password")
	
		if user != "admin" || pass != "admin" {
			return c.SendStatus(fiber.StatusUnauthorized)
		}
	
		token := jwt.New(jwt.SigningMethodHS256)
	
		claims := token.Claims.(jwt.MapClaims)
		claims["name"] = "Juan Perez"
		claims["admin"] = true
		//claims["exp"] = time.Now().Add(time.Hour * 2).Unix()
		claims["exp"] = time.Now().Add(time.Minute * 2).Unix()
	
		t, err := token.SignedString([]byte("secret"))
		if err != nil {
			return c.SendStatus(fiber.StatusInternalServerError)
		}
	
		return c.JSON(fiber.Map{ "token": t })
	}

	return c.SendStatus(fiber.StatusBadRequest)
}

func GetData(c *fiber.Ctx) error {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	name := claims["name"].(string)
	return c.JSON(fiber.Map {
		"id": c.Params("id"),
		"name": fmt.Sprintf("Nombre de %s", c.Params("id")),
		"someString": "Usuario: " + name,
	})
}

func Index(c *fiber.Ctx) error {
	user := c.Locals("user").(*jwt.Token)
	fmt.Printf("Raw token: %s\n", user.Raw)
	fmt.Printf("Header: %s\n", user.Header)
	fmt.Printf("Is valid: %v\n", user.Valid)
	fmt.Printf("Method: %s\n", user.Method)
	fmt.Printf("Signature: %s\n", user.Signature)
	fmt.Printf("Claims: %s\n", user.Claims)
	return c.Render("index", fiber.Map{
		"Title": "Title of index",
	})
}

func GetUsers(c *fiber.Ctx) error {
	dbConnect()
	defer db.Close()

	rows, err := db.Query("SELECT * FROM users order by id")

	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	defer rows.Close()
	result := dbmodels.Users{}

	for rows.Next() {
		user := dbmodels.User{}

		if err := rows.Scan(&user.Id, &user.Name, &user.Location); err != nil {
			return err
		}

		result.Users = append(result.Users, user)
	}

	return c.Render("users", fiber.Map{
		"Title": "Usuarios",
		"Data": result.Users,
	})
}

func WsMessage(c *websocket.Conn) {
	//
	fmt.Println(c.Locals("Host"))
	
	for {
		mt, msg, err := c.ReadMessage()
		if err != nil {
			log.Println("Read: ", err)
			break
		}
	
		log.Printf("Received: %s", msg)

		if string(msg) == "cmd1" {
			err = c.WriteMessage(mt, []byte("Respuesta a comando: cmd1"))
		} else {
			err = c.WriteMessage(mt, msg)
			if err != nil {
				log.Println("Write: ", err)
				break
			}
		}
	}
}