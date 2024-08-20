import bcrypt from 'bcrypt';
import Principal from '../models/Principal.js';

export const seedPrincipal = async () => {
  const existingPrincipal = await Principal.findOne({ email: 'principal@classroom.com' });
  
  if (!existingPrincipal) {
    const hashedPassword = await bcrypt.hash('Admin', 10); 
  
    const principal = new Principal({
      email: 'principal@classroom.com',
      password: hashedPassword,
    });

    await principal.save();
  } else {
  }
};
