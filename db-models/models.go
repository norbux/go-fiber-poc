package dbmodels

type User struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	Location string `json:"location"`
}

type Users struct {
	Users []User `json:"employees"`
}
