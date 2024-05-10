import React, { useState } from "react";
import countriesData from "./countries.json";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    state: "",
    city: "",
    gender: "",
    dob: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [responseMessage, setResponseMessage] = useState(null);


  // Populate countries dropdown
  useState(() => {
    setCountries(countriesData.countries.map((country) => country.name));
  }, []);

  // Handle country change
  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData({
      ...formData,
      country: selectedCountry,
      state: "",
      city: "",
    });
    const selectedCountryData = countriesData.countries.find(
      (country) => country.name === selectedCountry
    );
    if (selectedCountryData) {
      setStates(selectedCountryData.states.map((state) => state.name));
    }
  };

  // Handle state change
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData({
      ...formData,
      state: selectedState,
      city: "",
    });
    const selectedCountryData = countriesData.countries.find(
      (country) => country.name === formData.country
    );
    if (selectedCountryData) {
      const selectedStateData = selectedCountryData.states.find(
        (state) => state.name === selectedState
      );
      if (selectedStateData) {
        setCities(selectedStateData.cities);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you can make a POST request to your backend endpoint with the form data
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setResponseMessage(`Registration successful: ${data.firstName} ${data.lastName}`);
      // Clear form fields after successful registration
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        state: "",
        city: "",
        gender: "",
        dob: "",
      });
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.code === 11000) {
        setResponseMessage("Email already exists!");
      } else {
        setResponseMessage("Internal server error");
      }
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      {responseMessage && <h6>{responseMessage}</h6>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <select
          value={formData.country}
          onChange={handleCountryChange}
          required
        >
          <option value="">Select Country</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
        <select value={formData.state} onChange={handleStateChange} required>
          <option value="">Select State</option>
          {states.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
        >
          <option value="">Select City</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
        <div>
          <input
            type="radio"
            id="male"
            name="gender"
            value="Male"
            checked={formData.gender === "Male"}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
            required
          />
          <label htmlFor="male">Male</label>
          <input
            type="radio"
            id="female"
            name="gender"
            value="Female"
            checked={formData.gender === "Female"}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
            required
          />
          <label htmlFor="female">Female</label>
          <input
            type="radio"
            id="other"
            name="gender"
            value="Other"
            checked={formData.gender === "Other"}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
            required
          />
          <label htmlFor="other">Other</label>
        </div>
        <input
          type="date"
          placeholder="Date of Birth"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          required
        />
        <Link to="/showRecord">ShowRecord</Link>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
