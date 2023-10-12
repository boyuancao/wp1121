import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

const Register = () => {
  return (
    <CardFooter className="flex justify-between">
      <Button asChild variant="link" size="sm" className="px-0" type="button">
        <Link to="/login" data-testid="link-login">
          Already have an account?
        </Link>
      </Button>
      <Button size="sm">Register</Button>
    </CardFooter>
  );
};

export default Register;
