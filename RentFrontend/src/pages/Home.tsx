import { NavLink } from 'react-router-dom'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import '../App.css'

function Home() {
  return (
    <div className="page">
      <div className="hero">
        <div>
          <p className="eyebrow">BikeRent Платформа</p>
          <h1>Орендуйте велосипеди швидко та прозоро</h1>
          <p className="lead">
            Переглядайте станції, обирайте доступні велосипеди та керуйте своїми орендами в реальному часі.
          </p>
          <div className="hero-actions">
            <Button as="a" href="/bikes">
              Знайти велосипед
            </Button>
            <NavLink to="/register" className="link">
              Новий користувач? Зареєструйтеся
            </NavLink>
          </div>
        </div>
      </div>

      <div className="grid">
        <Card title="Велосипеди" subtitle="Фільтрація за станціями та типом">
          Дивіться деталі моделей, статус та вартість за годину.
        </Card>
        <Card title="Станції" subtitle="Вільні велосипеди поруч">
          Картки станцій з адресою та кількістю доступних велосипедів.
        </Card>
        <Card title="Оренди" subtitle="Старт і завершення">
          Запускайте оренду, відстежуйте активні поїздки та історію оплат.
        </Card>
      </div>
    </div>
  )
}

export default Home
