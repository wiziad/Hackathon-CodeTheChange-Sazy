import { Request, Response } from 'express';

interface DemoUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'donor' | 'receiver';
}

// Hardcoded users for demo
const DEMO_USERS: DemoUser[] = [
  {
    id: '1',
    email: 'ziaddhamed@gmail.com',
    password: 'ziad123',
    name: 'Ziad',
    role: 'receiver'
  },
  {
    id: '2',
    email: 'adrinas6543@gmail.com',
    password: 'adrina123',
    name: 'Adrina',
    role: 'donor'
  }
];

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user from hardcoded list
  const user = DEMO_USERS.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Return user info without password
  const { password: _, ...userWithoutPassword } = user;
  res.status(200).json({
    success: true,
    user: userWithoutPassword
  });
};

// For demo purposes, registration is disabled
export const register = (req: Request, res: Response) => {
  res.status(400).json({
    success: false,
    error: 'Registration is disabled. Please use one of the demo accounts:\n- ziaddhamed@gmail.com/ziad123\n- adrinas6543@gmail.com/adrina123'
  });
};