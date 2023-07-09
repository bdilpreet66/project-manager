import theme from './theme';

export default {
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: "100%",
  },
  logo: {
    width: 40 * 2,
    height: 46 * 2,
    alignSelf: 'center', 
    marginTop: 64,
    marginBottom: 20,
  },
  logoLabel: {
    width: 84 * 2,
    height: 90 * 2,
    alignSelf: 'center',     
    marginBottom: 20,
  },
  heading: {
    fontSize: theme.fontSize.large,
    fontWeight: '600',
    lineHeight: 27,
    letterSpacing: 0,
    textAlign: 'left',
  },
  button: {    
    borderRadius: 5,
    width: '90%', // Adjust width as per your requirement
    alignSelf: 'center', // This will center the button
    paddingHorizontal: 10,
    paddingVertical: 18,    
    marginTop: 40,
    marginBottom: 40,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonError: {
    backgroundColor: theme.colors.red,    
  },
  buttonText: {    
    textAlign: 'center', // Center the text inside the button
    fontWeight: theme.fontWeight.bold,
  },
  buttonTextPrimary: {
    color: theme.colors.white,
  },
  buttonTexError: {
    color: '#D85151',
  },
  inputContainer: {
    width: '90%',  // Or any suitable value
    alignSelf: 'center',
    marginTop: 20,
  }, 
  input: {
    paddingHorizontal: 12,    
    paddingVertical: 10,
    borderColor: theme.colors.grey,
    borderWidth: 1,
    borderRadius: 5,
    minWidth: "100%",
    fontSize: theme.fontSize.medium,
  },  
  inputLabel: {
    fontWeight: 'bold',
    marginBottom: 10,    
  },
  bold: {
    fontWeight: theme.fontWeight.bold,    
  },
  link: {
    color: theme.colors.primary,
  }
}