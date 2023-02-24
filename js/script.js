window.addEventListener('DOMContentLoaded', function() {

    const loginKey = document.querySelector('[data-login]');

    let auth, birth, userName, lastTime;
   
    checkAuth();
    
    loginKey.addEventListener('click',  (e) => { 
        e.preventDefault(); 
        const modalLog = document.querySelector('[data-log]'),
              modalPass = document.querySelector('[data-pass]'),
              login = modalLog.value,
              password = modalPass.value;
        if (login === '' || password === '') {
                errorValue("Пустое поле логина или пароля");
        } else {   
            axios({
                    method: 'post',
                    url: './api/login.php',
                    headers: {
                    "Content-type": "application/json; charset=UTF-8"
                    },
                    data:  {"login": login,"password": password}
                })
                .then((res) => {
                    console.log('Ответ сервера успешно получен!');
                    setAuth(res.data.auth);
                    setBirth(res.data.birth);
                    setUserName(res.data.name); 
                    setLastTime(res.data.time);
                    toggleModal();
                  //  updateLastTime(res.data.time);
                    statusAuth();
                    modalLog.value = '';
                    modalPass.value = '';
                })
                .catch(function(error) {
                    errorValue("Неверный пароль или имя пользователя!");
                    console.log(error);
                });
     
        }
    });

    function setAuth(arg) {
        auth = arg;
        console.log("auth", auth);
    }

    function setBirth(arg = null) {
        birth = arg;
        console.log("birth", birth);
    }

    function setUserName(arg = null) {
        userName = arg;
        console.log("userName", userName);
    }

    function setLastTime(arg = null) {
        lastTime = arg;
        console.log("lastTime", lastTime);
    }

    function updateLastTime(time = null) { 
        const userDiv =  document.querySelector('.user_block'),
              menuDiv = document.querySelector('.menu'),
              timerDiv = document.querySelector('.promotion');
        let days;
        if (time) { 
            if (birth !== null) {
                days = beforeDayBirthbay(birth);
                if (days === 0 ) { 
                    userDiv.innerHTML = `<p>С возвращением, ${userName}!</p>
                                    <p>С днем рождения! У нас для вас подарок!</p>
                                    <p>Последний раз вы у нас были в ${time}</p>`;
                } else {
                    userDiv.innerHTML = `<p>С возвращением, ${userName}!</p>
                                    <p>До вашего дня рождения осталось дней: ${days}!</p>
                                    <p>Последний раз вы у нас были в ${time}</p>`;
                }
            } else {
                userDiv.innerHTML = `<p>С возвращением, ${userName}!</p>
                                    <br>
                                    <p>Последний раз вы у нас были в ${time}</p>`;
            }
            // Если ДР поздравим и откроем акцию
            if (days === 0) { 
                toggleConfirm(); 
                menuDiv.classList.remove('hide');
                timerDiv.classList.remove('hide');
                startTimer();
            } else {
                menuDiv.classList.add('hide');
                timerDiv.classList.add('hide');
            }
        } else {
            if (!menuDiv.classList.contains('hide')) {
                menuDiv.classList.add('hide');
            }  
            if (!timerDiv.classList.contains('hide')) {
                timerDiv.classList.add('hide');
            }  
            userDiv.innerHTML = '';
        }

    }

    function startTimer() {
        let deadline = new Date(); // присваиваем переменной текущую дату
        // Считает дедлайн - текущее время до 24 часов
        deadline = ((24 - deadline.getHours()) * 60 * 60 * 1000) + Date.parse(deadline);
        //deadline.setDate(deadline.getDate() + 1); // устанавливаем дату на плюс 1 день
        setCloak('.timer', deadline);
    }

    function beforeDayBirthbay(start) {  
        // Приводим дату старта в единый формат и в текущий год 
        //const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
        //let date1 = new Date(start.replace(pattern,'$2-$1-$3'));
        year = start.substr(6) * 1;
        month = start.substr(3, 2) * 1 - 1;
        day = start.substr(0, 2) * 1;
        let date1 = new Date(year, month, day);
        date1.setYear(new Date().getFullYear());
        const date2 = new Date(); 
            
        // Один день в миллисекундах
        const oneDay = 1000 * 60 * 60 * 24; 
            
        // Считаем разницу дат
        const diffInTime = date2.getTime() - date1.getTime(); 
        
        // Считаем число дней
        let diffInDays = Math.floor(diffInTime / oneDay); 
        
        if (diffInDays < 0) {
            return Math.abs(diffInDays); 
        } else {
            if (diffInDays > 0) {
                return 365 - diffInDays;
            } else {
                return diffInDays;
            }
        }
     
    }

    function checkAuth() {
        axios.get(`./api/checkAuth.php`)
             .then(res => {
                setAuth(res.data.auth);
                if (res.data.auth) {
                    setLastTime(res.data.time);
                    setUserName(res.data.name);
                    setBirth(res.data.birth);
                } else {
                    setLastTime();
                }   
                statusAuth();
              });
    }

    function statusAuth() { 
        // Переделаем главную кнопку авторизации
        const modalAuthKey = document.querySelector('[data-modal]');
        if (auth) {
            modalAuthKey.textContent = 'Выйти';
            modalAuthKey.removeEventListener('click', toggleModal); 
            modalAuthKey.addEventListener('click', logout); 
            updateLastTime(lastTime);
            window.removeEventListener('scroll', showModalByScroll);
        } else {
            modalAuthKey.textContent = 'Авторизуйтесь';
            modalAuthKey.removeEventListener('click', logout); 
            modalAuthKey.addEventListener('click', toggleModal); 
            updateLastTime();
            window.addEventListener('scroll', showModalByScroll);
        }
    }
    
    function logout() {
        axios.get("./api/logout.php")
             .then((res) => {
                setAuth(false);
                setBirth();
                setUserName(); 
                setLastTime();
                statusAuth();
           });
    }

    function errorValue(message) {
        // Формирование слоя вывода ошибки с динамической подстановкой сообщения
        const modalDiv =  document.querySelector('.modal__content'),
              errorMessage = document.createElement('div');
        errorMessage.classList.add('error');
        errorMessage.style.cssText = `color: red; text-align: center;`;
        errorMessage.textContent = message;
        // Вставляем новый слой ниже кнопки ввода
        modalDiv.append(errorMessage);
        setTimeout(() => {
            // Удаляем слой через 3000 мс
            errorMessage.remove();
        }, 3000);  
    }

  

    // Tabs
    
	let tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	function hideTabContent() {
        
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
	}

	function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }
    
    hideTabContent();
    showTabContent();

	tabsParent.addEventListener('click', function(event) {
		const target = event.target;
		if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
		}
	});

    // Timer

    function getTimeRemaining(endtime) {
        const t = endtime - Date.parse(new Date()),
              days = Math.floor(t / (1000*60*60*24)),
              hours = Math.floor((t / (1000*60*60) % 24)),
              minutes = Math.floor(((t / 1000 / 60) % 60)),
              seconds = Math.floor((t / 1000) % 60);
      
        return t > 0 ? 
             { total : t, days, hours, minutes, seconds } :
             { total : 0, days : 0, hours : 0, minutes : 0, seconds :0 };
    }

    function getZero(num) {
        if (num >=0 && num <10) {
            return `0${num}`;
        } else  {
            return num;
        }
    }

    function setCloak(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();
        
        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0 ) {
                clearInterval(timeInterval);
            }
        }
    }

    // Confirm

    const confirm = document.querySelector('.confirm');
    
    function toggleConfirm() {
        confirm.classList.toggle('hide');
    }

    confirm.addEventListener('click', () => { 
            toggleConfirm();
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && !confirm.classList.contains('hide')) { 
            toggleConfirm();
        }
    });

    // Modal

    const modal = document.querySelector('.modal'),
          modalCloseBtn = document.querySelector('[data-close]');
   
    modalCloseBtn.addEventListener('click', toggleModal);
    
    function toggleModal() {
        modal.classList.toggle('hide');
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            toggleModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && !modal.classList.contains('hide')) { 
            toggleModal();
        }
    });

    function showModalByScroll() {
         if ((window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) && !auth) {
              toggleModal();
          }
    }

// Не удалять! Конец скрипта!
});