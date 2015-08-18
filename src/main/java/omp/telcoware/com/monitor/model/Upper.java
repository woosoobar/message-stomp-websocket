package omp.telcoware.com.monitor.model;

import java.util.ArrayList;

public class Upper
{
  private String upper;
  private ArrayList<Lower> value;

  public String getUpper()
  {
    return this.upper; }

  public void setUpper(String upper) {
    this.upper = upper; }

  public ArrayList<Lower> getValue() {
    return this.value; }

  public void setValue(ArrayList<Lower> value) {
    this.value = value;
  }
}