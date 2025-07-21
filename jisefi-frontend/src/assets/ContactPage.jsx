import React from 'react';

const Contact = () => {
    return (
        <>
        <div className="contact-page">
            <h1>Contact Us</h1>
            <p>Feel free to reach out to us through the form below.</p>
            <form className="contact-form">
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" />
                </div>
                <div>
                    <placeholder>message</placeholder>
                    <textarea id="message" name="message"></textarea>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>\
        </>
    
    );
};

export default Contact;