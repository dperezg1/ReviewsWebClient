import { MovieDPage } from './app.po';

describe('MovieD App', function() {
  let page: MovieDPage;

  beforeEach(() => {
    page = new MovieDPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
