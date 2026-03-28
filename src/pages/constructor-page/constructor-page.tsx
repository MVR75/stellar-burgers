import { useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';
import {
  selectLoading,
  selectIngredientsErrors
} from '../../slices/ingredientsSlice';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectLoading);
  const error = useSelector(selectIngredientsErrors);

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        {isIngredientsLoading ? (
          <Preloader />
        ) : error ? (
          <div className={`${styles.error} text text_type_main-medium pt-4`}>
            {error}
          </div>
        ) : (
          <BurgerIngredients />
        )}
        <BurgerConstructor />
      </div>
    </main>
  );
};
