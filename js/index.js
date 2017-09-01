
window.addEventListener("DOMContentLoaded", function () {
	var form = document.getElementById("search-form");

	document.getElementById("search-button").addEventListener("click", function () {
	  form.submit();
	});
});