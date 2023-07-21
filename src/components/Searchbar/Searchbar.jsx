import { Formik, Form, Field } from 'formik';
import PropTypes from 'prop-types';
import { BsSearch } from 'react-icons/bs';

import css from './Searchbar.module.css';

const Searchbar = ({ onSubmit }) => {
  const handleSubmit = async (values, actions) => {
    await onSubmit(values.query);
    actions.resetForm();
  };

  return (
    <header className={css.searchbar}>
      <Formik initialValues={{ query: '' }} onSubmit={handleSubmit}>
        <Form className={css.searchForm}>
          <button type="submit" className={css.searchFormButton}>
            <BsSearch />
            <span className="button-label">Search</span>
          </button>

          <label className={css.searchFormButtonLabel}>
            <Field
              className={css.searchFormInput}
              type="text"
              name="query"
              autoComplete="off"
              autoFocus
              placeholder="Search images and photos"
            />
          </label>
        </Form>
      </Formik>
    </header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
