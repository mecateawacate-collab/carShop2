package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Auto struct {
	Id          uint    `json:"id" gorm:"primaryKey"`
	Marca       string  `json:"marca"`
	Modelo      string  `json:"modelo"`
	Anio        int     `json:"anio"`
	Precio      float64 `json:"precio"`
	Descripcion string  `json:"descripcion"`
	ImagenUrl   string  `json:"imagenUrl"`
}

type RolUsuario struct {
	Id    uint   `json:"id" gorm:"primaryKey"`
	Email string `json:"email"`
	Rol   string `json:"rol"`
}

var db *gorm.DB

func inicializarBD() {
	dsn := "host=aws-0-us-east-2.pooler.supabase.com user=postgres.seacduobnuaybywwohbt password=AWACATe2019$$ dbname=postgres port=5432 sslmode=require"
	var err error
	if db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{}); err != nil {
		log.Fatal("Error conectando a Supabase:", err)
	}
	db.AutoMigrate(&Auto{})
}

func verificarRol(c *fiber.Ctx) error {
	email := c.Query("email")
	if email == "" {
		return c.Status(400).JSON(fiber.Map{"mensaje": "El correo es requerido"})
	}

	var rol RolUsuario
	esAdmin := db.Table("roles").Where("email = ?", email).First(&rol).Error == nil && rol.Rol == "admin"
	
	rolTexto := "cliente"
	if esAdmin {
		rolTexto = "admin"
	}

	return c.JSON(fiber.Map{
		"email":   email,
		"rol":     rolTexto,
		"esAdmin": esAdmin,
	})
}

func listarAutos(c *fiber.Ctx) error {
	var autos []Auto
	consulta := db
	if q := c.Query("buscar"); q != "" {
		patron := "%" + q + "%"
		consulta = consulta.Where("marca ILIKE ? OR modelo ILIKE ?", patron, patron)
	}
	consulta.Find(&autos)
	return c.JSON(autos)
}

func crearAuto(c *fiber.Ctx) error {
	var auto Auto
	if err := c.BodyParser(&auto); err != nil {
		return c.Status(400).JSON(fiber.Map{"mensaje": "Datos inválidos"})
	}
	db.Create(&auto)
	return c.Status(201).JSON(auto)
}

func actualizarAuto(c *fiber.Ctx) error {
	var auto Auto
	if err := db.First(&auto, c.Params("id")).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"mensaje": "Auto no encontrado"})
	}

	var datos Auto
	if err := c.BodyParser(&datos); err != nil {
		return c.Status(400).JSON(fiber.Map{"mensaje": "Datos inválidos"})
	}

	db.Model(&auto).Updates(datos)
	return c.JSON(auto)
}

func eliminarAuto(c *fiber.Ctx) error {
	db.Delete(&Auto{}, c.Params("id"))
	return c.JSON(fiber.Map{"mensaje": "Auto eliminado correctamente"})
}

func main() {
	inicializarBD()

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	api := app.Group("/api")
	api.Get("/autos", listarAutos)
	api.Post("/autos", crearAuto)
	api.Put("/autos/:id", actualizarAuto)
	api.Delete("/autos/:id", eliminarAuto)
	api.Get("/verificar-rol", verificarRol)

	log.Println("Backend CarShop listo en http://localhost:8080")
	log.Fatal(app.Listen(":8080"))
}