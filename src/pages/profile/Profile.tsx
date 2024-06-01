import { FC } from 'react';
import './Profile.scss';

const Profile: FC = () => {
  return (
    <>
      <header>
        <h1 className="pageHeader">Профиль</h1>
      </header>

      <main>
        <section>
          <img
            className="userImage"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKbYRZrjyxSgBaHrn9NtIyn6CyM6pj-V5_7w&usqp=CAU"
            alt="Картинка профиля"
          />
          <span className="inputTitle">
            Фамилия<span>*</span>
          </span>
          <input placeholder="Иванов" type="text" value="" />

          <span className="inputTitle">
            Имя <span>*</span>
          </span>
          <input placeholder="Иван" type="text" />

          <span className="inputTitle">Отчество</span>
          <input placeholder="Иванович" type="text" />

          <div className="genderChoice">
            <span className="inputTitle">
              Пол <span>*</span>
            </span>

            <div>
              <input type="radio" name="group1" />
              <span>Мужской</span>
            </div>

            <div>
              <input type="radio" name="group1" />
              <span>Женский</span>
            </div>
          </div>

          <div className="birthDate">
            <span className="inputTitle">
              Дата рождения <span>*</span>
            </span>
            <input type="date" />
          </div>

          <div>
            <span className="inputTitle">
              Email <span>*</span>
            </span>
            <input placeholder="example@itmo.edu" type="email" />
          </div>

          <button className="submitButton">Сохранить</button>
        </section>
      </main>

      <footer>
        <address>
          <a className="link" href="/#" target="_blank">
            Россия, г. Санкт-Петербург, ИТМО
          </a>
        </address>
      </footer>
    </>
  );
};

export default Profile;
