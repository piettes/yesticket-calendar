const googleCalendarBaseUrl = "https://www.googleapis.com/calendar/v3/calendars";
const calendarId = "ac667b932cd08fb6f8af3792b961b4c92867e201bea405de2251f891588884c7@group.calendar.google.com";
const googleAPIKey = "";

const yesticketBaseUrl = "https://www.yesticket.org/api/events-endpoint.php";

const organizer = "14";
const type = "all";
const key = "6bd5501ae758318bb5195e2b";

let userLocale = 'en-us';
if (navigator.languages) {
	userLocale = navigator.languages[0]
}

const fetchEventsGoogle = (monthOffset = 0) => {

	const date = new Date();
	const offsetDate = new Date(date.getFullYear(), date.getMonth() + monthOffset, 1);

	const firstDay = new Date(offsetDate.getFullYear(), offsetDate.getMonth(), 1);
	const firstDayNextMonth = new Date(offsetDate.getFullYear(), offsetDate.getMonth() + 1, 1);

	const googleCalendarUrl = `${googleCalendarBaseUrl}/${calendarId}/events?key=${googleAPIKey}&timeMax=${firstDayNextMonth.toISOString()}&timeMin=${firstDay.toISOString()}`;

	return fetch(googleCalendarUrl)
		.then(result => result.json())
		.then((data) => {
			console.log(data);
			return data.items;
		});
}

const fillCalendarGoogle = (items) => {
	items.forEach(item => {
		let day;
		if (item.start.date) {
			const date = new Date(item.start.date);
			day = date.getDate();
		} else if (item.start.dateTime) {
			const date = new Date(item.start.dateTime);
			day = date.getDate();
		} else {
			console.log("WOOOOOOOW");
			console.log(item.start);
		}
		const dayCell = document.getElementById(`liber-calendar-day-${day}`);
		dayCell.textContent = item.summary;
	});
}

const fetchEventsYesTicket = () => {
	// const date = new Date();
	// const offsetDate = new Date(date.getFullYear(), date.getMonth() + monthOffset, 1);

	// const firstDay = new Date(offsetDate.getFullYear(), offsetDate.getMonth(), 1);
	// const firstDayNextMonth = new Date(offsetDate.getFullYear(), offsetDate.getMonth() + 1, 1);

	// const googleCalendarUrl = `${googleCalendarBaseUrl}/${calendarId}/events?key=${APIKey}&timeMax=${firstDayNextMonth.toISOString()}&timeMin=${firstDay.toISOString()}`;
	const yesTicketUrl = `${yesticketBaseUrl}?organizer=${organizer}&key=${key}&type=${type}`;

	return fetch(yesTicketUrl)
		.then(result => result.json())
	// .then((items) =>
	// 	items.filter(item => {
	// 		// as we get all events, we have to filter out the one not in the current month
	// 		let eventDate = new Date(item.event_datetime);
	// 		if (eventDate > firstDayNextMonth) {
	// 			return false;
	// 		} else if (eventDate < firstDay) {
	// 			return false;
	// 		}
	// 		return true;
	// 	})
	// );
}

const fillCalendarYesTicket = (firstDay, lastDay) => {
	yesTicketEvents.forEach(show => {
		let day;
		if (show.event_datetime) {
			const date = new Date(show.event_datetime);
			day = date.getDate();
			if (date > firstDay && date < lastDay) {
			const dayCell = document.getElementById(`liber-calendar-day-${day}`);
			dayCell.style.backgroundImage = `url("${show.event_picture_url}")`;
			dayCell.addEventListener('mouseover', () => displaySelectedShow(show));

			}
		} else {
			console.error("Yest Ticket event without event_datetime");
			console.log(show);
		}
	});
}

const displaySelectedShow = (show) => {

	const theShow = document.getElementById(`liber-calendar-selected-show`);

	if (show.event_picture_url) {
		const showImage = document.createElement('div');
		showImage.style.backgroundImage = `url("${show.event_picture_url}")`;
		showImage.className = "bg-no-repeat bg-contain h-48"
		theShow.replaceChildren(showImage);
	}

	const showTitle = document.createElement('div');
	showTitle.innerText = show.event_name;
	showTitle.className = "my-2";

	if (show.event_picture_url) {
		theShow.appendChild(showTitle);
	} else {
		theShow.replaceChildren(showTitle);
	}

	const showDescription = document.createElement('div');
	showDescription.innerText = show.event_description;
	showDescription.className = "text-justify"

	theShow.appendChild(showDescription);
}

const drawCalendar = (monthOffset = 0) => {
	const date = new Date();
	const offsetDate = new Date(date.getFullYear(), date.getMonth() + monthOffset, 1);

	const firstDay = new Date(offsetDate.getFullYear(), offsetDate.getMonth(), 1);
	const lastDay = new Date(offsetDate.getFullYear(), offsetDate.getMonth() + 1, 0);

	const calendar = document.getElementById('liber-calendar-content');
	calendar.replaceChildren([]);

	// modulo 7 because Sunday is the first day (0) of the week
	const firstDayNumber = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

	for (let i = 0; i < 6 * 7; i++) {
		const div = document.createElement('div');
		if (i >= firstDayNumber && i < lastDay.getDate() + firstDayNumber) {
			const day = i - firstDayNumber + 1;
			div.textContent = day;
			div.id = `liber-calendar-day-${day}`;
			div.className = "day-cell"
		}
		calendar.appendChild(div);
	}

	document.getElementById('liber-calendar-month').innerText = offsetDate.toLocaleString(userLocale, {month: 'long'});

	const prevButton = document.createElement('button');
	prevButton.innerText = "Prev";
	prevButton.addEventListener('click', () => {
		drawCalendar(monthOffset - 1);
	});
	document.getElementById(`liber-calendar-prev-button`).replaceChildren(prevButton);

	const nextButton = document.createElement('button');
	nextButton.innerText = "Next";
	nextButton.addEventListener('click', () => {
		drawCalendar(monthOffset + 1);
	});
	document.getElementById(`liber-calendar-next-button`).replaceChildren(nextButton);

	fillCalendarYesTicket(firstDay, lastDay);
}


let yesTicketEvents = [];
fetchEventsYesTicket().then(events => {
	yesTicketEvents = events;
	drawCalendar();
});



