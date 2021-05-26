import React from 'react';
import { useSelector } from 'react-redux';
import * as P from './parts';
import { getErrors } from '../../store/selectors';
import { ApplicationState, ErrorsState, ErrorType } from '../../store/constants';

const ErrorLog: React.FC = () => {
   const errorMessages = useSelector<ApplicationState, ErrorsState>(getErrors);

   return (
      <P.ErrorLogWrapper>
         <P.Header>Error Log</P.Header>
         {Object.keys(errorMessages).map((errorCategory) => (
            <P.Error key={errorCategory}>
               {`${errorCategory}: ${errorMessages[errorCategory as ErrorType]}`}
            </P.Error>
         ))}
      </P.ErrorLogWrapper>
   )
}

export default ErrorLog;