import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUserEmail,
  selectUserName,
  updateUser
} from '../../slices/userSlice';
import { TRegisterData } from '@api';

export const Profile: FC = () => {
  const name = useSelector(selectUserName) ?? '';
  const email = useSelector(selectUserEmail) ?? '';

  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: name,
    email: email,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: name || '',
      email: email || ''
    }));
  }, [name, email]);

  const isFormChanged =
    formValue.name !== name ||
    formValue.email !== email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const payload: Partial<TRegisterData> = {
      name: formValue.name,
      email: formValue.email
    };

    if (formValue.password) {
      payload.password = formValue.password;
    }

    dispatch(updateUser(payload));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: name,
      email: email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );

  return null;
};
