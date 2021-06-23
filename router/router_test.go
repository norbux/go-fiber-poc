package router

import (
	"fmt"
	"io/ioutil"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/form3tech-oss/jwt-go"
	"github.com/gofiber/fiber/v2"
)

func TestGetData(t *testing.T) {
	app := fiber.New()
	Setup(app)

	req := httptest.NewRequest("GET", "/GetData/1", nil)
	req.Header.Set("X-Custom-Header", "hi")
	req.Header.Set("Content-Type", "application/json")

	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["name"] = "Juan Perez"
	claims["admin"] = true
	claims["exp"] = time.Now().Add(time.Hour * 2).Unix()

	tk, _ := token.SignedString([]byte("secret"))
	req.Header.Set("Authorization", "Bearer " + tk)

	resp, err := app.Test(req, -1)

	if err != nil {
		fmt.Println("..::Error::..")
	} else {
		fmt.Println("Todo bien")
	}

	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println(string(body))

	// Buscar un substring en el body
	// if !strings.Contains(string(body), "No hay") {
	// 	fmt.Println("El body no contiene 'No hay'")
	// 	t.Fail()
	// }
}

func BenchmarkSprintf(b *testing.B) {
	for i:= 0; i < b.N; i++ {
		fmt.Sprintf("benchhhmark")
	}
}

func f() {
	var a[]int

	for i := 0; i > 100; i++ {
		_ = append(a, i*3)
	}
}

func BenchmarkF(b *testing.B) {
	for i := 0; i < b.N; i++ {
		f()
	}
}