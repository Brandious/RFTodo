const isEmpty = (string) => {
  if (string.trim() === "") return true;
  return false;
};

exports.validateLoginData = (data) => {
  let errors = {};
  if (isEmpty(data.email)) errors.email = "Unesite Email...";
  if (isEmpty(data.password)) errors.password = "Unesite Password ...";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

const isEmail = (email) => {
	const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email.match(emailRegEx)) return true;
	else return false;
};


exports.validateSignUpData = (data) => 
{
    let errors = {};

    if(isEmpty(data.email)) errors.email = "Unesite Email...";
    else if(!isEmail(data.email)) errors.email = "Email nije pravilan";

    if(isEmpty(data.firstName)) errors.firstName = "Ne smije biti prazno...";
    if(isEmpty(data.lastName)) errors.lastName = "Ne smije biti prazno...";
    if(isEmpty(data.phoneNumber)) errors.phoneNumber = "Ne smije biti prazno...";
    if(isEmpty(data.country)) errors.country = "Ne smije biti prazno...";

    if(isEmail(data.password)) errors.password = "Unesite password";
    if(data.password !== data.confirmPassword)
        errors.confirmPassword = "Passwordi se moraju poklapati";
    
    if(isEmpty(data.username)) errors.username = 'Ne smije biti prazno';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }

}