import PropTypes from 'prop-types';
import { useState } from 'react';
import { notification } from '../../notification/notification';
import {
  Header,
  Form,
  FormButton,
  FormLabel,
  FormInput,
} from './Searchbar.styled';

export const Searchbar = ({ onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      notification(
        'The search input can not be empty. Please enter a search query'
      );
      return;
    }

    onSubmit(searchQuery.trim().toLowerCase());
    setSearchQuery('');
  };

  const handleInput = e => {
    setSearchQuery(e.currentTarget.value.trim().toLowerCase());
  };

  return (
    <Header>
      <Form type="submit" onSubmit={handleSubmit}>
        <FormButton>
          <FormLabel>Search</FormLabel>
        </FormButton>

        <FormInput
          type="text"
          autocomplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={searchQuery}
          onChange={handleInput}
        />
      </Form>
    </Header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
