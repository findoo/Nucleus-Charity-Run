import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';

global.expect = chai.expect;
configure({ adapter: new Adapter() });